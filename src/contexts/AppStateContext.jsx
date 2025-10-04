import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  calculateCurrentAge,
  getCurrentWeekNumber,
  calculateTotalWeeks,
  calculateLifeExpectancy,
  decodeURLToState,
  encodeStateToURL,
} from '../utils';

const AppStateContext = createContext();

const initialState = {
  name: '',
  birthdate: null,
  gender: 'male',
  country: 'US',
  customLifeExpectancy: null,
  lifeStages: {
    school: {
      startAge: 6,
      duration: 12,
    },
    college: {
      startAge: 18,
      duration: 4,
    },
    career: {
      startAge: 22,
      endAge: 65,
    },
    retirement: {
      startAge: 65,
    },
  },
  showLifeStages: false,
  markedWeeks: new Map(),
  selectedWeeks: new Set(),
  showForm: true,
  showLegend: true,
  countries: [],
};

export function AppStateProvider({ children }) {
  const { i18n } = useTranslation();
  const [state, setState] = useState(initialState);
  const urlUpdateTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize from URL on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      const urlParams = window.location.search;
      if (urlParams) {
        const urlState = decodeURLToState(urlParams);
        if (Object.keys(urlState).length > 0) {
          setState((prev) => ({ ...prev, ...urlState }));

          // Set language if in URL
          if (urlState.language) {
            i18n.changeLanguage(urlState.language);
          }
        }
      }
      isInitializedRef.current = true;
    }
  }, [i18n]);

  // Update URL when state changes (debounced)
  useEffect(() => {
    if (!isInitializedRef.current) return;

    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
    }

    urlUpdateTimeoutRef.current = setTimeout(() => {
      if (state.birthdate) {
        try {
          const newURL = encodeStateToURL(state);
          window.history.replaceState({}, '', newURL);
        } catch (error) {
          console.error('Failed to update URL:', error);
        }
      }
    }, 300);

    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, [
    state.name,
    state.birthdate,
    state.gender,
    state.country,
    state.customLifeExpectancy,
    state.markedWeeks,
    state.lifeStages,
    state.showLifeStages,
    state.showForm,
    state.showLegend,
  ]);

  const setUserData = (data) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  const setLifeStages = (stages) => {
    setState((prev) => ({
      ...prev,
      lifeStages: { ...prev.lifeStages, ...stages },
    }));
  };

  const toggleLifeStages = () => {
    setState((prev) => ({ ...prev, showLifeStages: !prev.showLifeStages }));
  };

  const addWeekMarking = (weekNumber, marking) => {
    setState((prev) => {
      const newMarkings = new Map(prev.markedWeeks);
      newMarkings.set(weekNumber, marking);
      return { ...prev, markedWeeks: newMarkings };
    });
  };

  const removeWeekMarking = (weekNumber) => {
    setState((prev) => {
      const newMarkings = new Map(prev.markedWeeks);
      newMarkings.delete(weekNumber);
      return { ...prev, markedWeeks: newMarkings };
    });
  };

  const selectWeeks = (weekNumbers) => {
    setState((prev) => ({ ...prev, selectedWeeks: new Set(weekNumbers) }));
  };

  const toggleForm = () => {
    setState((prev) => ({ ...prev, showForm: !prev.showForm }));
  };

  const toggleLegend = () => {
    setState((prev) => ({ ...prev, showLegend: !prev.showLegend }));
  };

  const setCountries = (countries) => {
    setState((prev) => ({ ...prev, countries }));
  };

  // Computed values
  const currentAge = state.birthdate ? calculateCurrentAge(state.birthdate) : null;
  const currentWeekNumber = state.birthdate ? getCurrentWeekNumber(state.birthdate) : 0;
  const lifeExpectancy = calculateLifeExpectancy({
    countries: state.countries,
    countryCode: state.country,
    gender: state.gender,
    customLifeExpectancy: state.customLifeExpectancy,
  });
  const totalWeeks = calculateTotalWeeks(lifeExpectancy);

  const value = {
    ...state,
    currentAge,
    currentWeekNumber,
    lifeExpectancy,
    totalWeeks,
    setUserData,
    setLifeStages,
    toggleLifeStages,
    addWeekMarking,
    removeWeekMarking,
    selectWeeks,
    toggleForm,
    toggleLegend,
    setCountries,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
