import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';

import { MMKWStorageService } from 'src/services';
import { colors, fonts } from 'src/theme';
import {
  InfoTitleBar,
  InfoTitleBarType,
  Button,
  ButtonType,
  Separator,
  Checkbox,
} from 'src/components';
import { languages } from 'src/libs/translation';
import { HomeStackParamList, AppNavigator } from 'src/navigation/types';

type Props = NativeStackScreenProps<
  HomeStackParamList,
  AppNavigator.LanguageSelectScreen
>;

export const LanguageSelectScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { t, i18n } = useTranslation();
  const onDoneButtonTitle = route.params?.isSettings
    ? t('complete')
    : t('continue');

  const onSelectLanguage = (language: string) => {
    MMKWStorageService.setRecord('language', language);
    i18n.changeLanguage(language);
  };

  const onDone = () => {
    if (route.params?.isSettings) {
      navigation.goBack();
    } else {
      navigation.navigate(AppNavigator.AlphaAlertScreen);
    }
  };

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Secondary}
        title={t('selectLanguage')}
      />
      <View>
        <Text style={styles.title}>{t('language')}</Text>
        <Separator />
        {languages.map(language => (
          <View key={language}>
            <View
              style={[
                styles.checkboxContainer,
                i18n.language === language && styles.checkboxSelected,
              ]}
            >
              <Checkbox
                isChecked={i18n.language === language}
                onChange={() => onSelectLanguage(language)}
              />
              <Text style={styles.checkboxTitle}>{t(language)}</Text>
            </View>
            <Separator />
          </View>
        ))}
      </View>

      <View style={styles.bottomBlock}>
        <Button
          type={ButtonType.primary}
          title={onDoneButtonTitle}
          onPress={onDone}
          accessibilityLabel="Submit Button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayLight,
  },
  bottomBlock: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 'auto',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingLeft: 16,
  },
  checkboxSelected: {
    backgroundColor: colors.purpleWhite,
  },
  title: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 16,
  },
  checkboxTitle: {
    fontSize: 16,
    lineHeight: 28,
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 8,
  },
});
