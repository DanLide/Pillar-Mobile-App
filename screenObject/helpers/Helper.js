import { element, by } from 'detox';

class Helper {
  static async getElementName(locator, locatorType = 'id') {
    try {
      let detoxElement;

      switch (locatorType) {
        case 'id':
          detoxElement = element(by.id(locator));
          break;
        case 'label':
          detoxElement = element(by.label(locator));
          break;
        case 'text':
          detoxElement = element(by.text(locator));
          break;
        default:
          throw new Error(`Unsupported locator type: ${locatorType}`);
      }

      const attributes = await detoxElement.getAttributes();

      if (attributes) {
        return (
          attributes.name || attributes.label || 'Name or Label do not exist'
        );
      }

      return 'Name or Label do not exist';
    } catch (error) {
      console.error('Error extracting element name:', error);
      return 'Error';
    }
  }
}

export default Helper;
