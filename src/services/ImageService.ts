import * as ImagePicker from 'react-native-image-picker';

export const selectImage = (options?: ImagePicker.Options): Promise<ImagePicker.Response> => {

  return new Promise((resolve) => {
    const defaultOptions: ImagePicker.Options = {
      title: '选择图片',
      maxWidth: 1000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.launchImageLibrary(Object.assign(defaultOptions, options), async (response) => {
      resolve(response);
    });
  });
};
