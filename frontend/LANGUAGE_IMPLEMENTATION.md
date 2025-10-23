# Language Preference Implementation Guide

## Overview
The Relief Hub application now supports **6 South African languages**:
- **English** (en)
- **Afrikaans** (af)
- **Zulu** (zu)
- **Xhosa** (xh)
- **Sotho** (st)
- **Tsonga** (ts)

## How It Works

### 1. Technology Stack
- **i18next**: Core internationalization framework
- **react-i18next**: React bindings for i18next
- **i18next-browser-languagedetector**: Automatic language detection

### 2. File Structure
```
frontend/
├── src/
│   ├── i18n.js                    # i18next configuration
│   ├── locales/                   # Translation files
│   │   ├── en.json               # English translations
│   │   ├── af.json               # Afrikaans translations
│   │   ├── zu.json               # Zulu translations
│   │   ├── xh.json               # Xhosa translations
│   │   ├── st.json               # Sotho translations
│   │   └── ts.json               # Tsonga translations
```

### 3. How to Use Translations in Components

#### Basic Usage
```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('common.welcome')}</h1>
            <button>{t('common.save')}</button>
        </div>
    );
};
```

#### Changing Language Programmatically
```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <button onClick={() => changeLanguage('zu')}>
            Switch to Zulu
        </button>
    );
};
```

### 4. Language Preference Flow

1. **User selects language** in Preferences tab (`PreferencesTab.js`)
2. **Dashboard component** detects the change (`Dashboard.js:60-62`)
3. **i18next changes language** via `i18n.changeLanguage(newValue)`
4. **All components re-render** with new translations automatically
5. **Preference is saved** to localStorage (key: `i18nextLng`)

### 5. Translation Keys Structure

All translations follow this nested structure:

```json
{
  "common": {
    "welcome": "Welcome",
    "save": "Save",
    "cancel": "Cancel"
    // ... more common keys
  },
  "dashboard": {
    "title": "Dashboard",
    "overview": "Overview"
    // ... more dashboard keys
  },
  "preferences": {
    "language": "Language",
    "theme": "Theme"
    // ... more preference keys
  }
  // ... more sections
}
```

### 6. Components with Translations

The following components have been updated to use translations:

1. **PreferencesTab.js** - Full translation support for all preference options
2. **DashboardContent.js** - Welcome message translation
3. **Dashboard.js** - Language change handler integration

### 7. Adding New Translations

To add a new translatable string:

1. **Add the key to ALL 6 language files** (`src/locales/*.json`):
   ```json
   {
     "mySection": {
       "myNewKey": "My translation in [language]"
     }
   }
   ```

2. **Use it in your component**:
   ```javascript
   const { t } = useTranslation();
   return <div>{t('mySection.myNewKey')}</div>;
   ```

### 8. Testing Language Changes

1. Run the application: `npm start`
2. Login to the dashboard
3. Navigate to: **Manage Profile > Preferences tab**
4. Change the **Language** dropdown
5. UI should immediately update to show selected language

### 9. Language Detection

The app automatically detects language in this order:
1. **localStorage** (`i18nextLng` key)
2. **Browser language** (if no saved preference)
3. **Fallback to English** (if detection fails)

### 10. Supported Features

✅ Real-time language switching (no page reload needed)
✅ Persistent language preference (saved to localStorage)
✅ 6 South African languages
✅ Automatic browser language detection
✅ Fallback to English for missing translations
✅ Integrated with user preferences UI

## Future Enhancements

To fully translate the entire application:

1. **Add more translation keys** to all 6 language files
2. **Update remaining components** to use `useTranslation()` hook
3. **Translate error messages** and validation messages
4. **Add date/time formatting** based on locale
5. **Add number/currency formatting** based on locale
6. **Backend integration** to save language preference to user profile

## Technical Notes

- Language preference is stored in both:
  - **localStorage** (key: `i18nextLng`) - for i18next
  - **localStorage** (key: `userPreferences`) - for user preferences JSON
- Language changes are **instant** - no page reload required
- Missing translations automatically fall back to English
- All translations are loaded on app initialization (no lazy loading yet)

## Support

For questions or issues with the language implementation, please refer to:
- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
