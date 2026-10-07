import { Alert, Platform } from 'react-native';

interface ConfirmHost {
  confirm?: (message: string) => boolean;
}

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
};

/** Cross-platform confirmation dialog (Alert is a no-op on web). */
export function confirmAction({
  title,
  message,
  confirmLabel,
  destructive = false,
}: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === 'web') {
    const host = globalThis as ConfirmHost;
    return Promise.resolve(host.confirm?.(`${title}\n${message}`) ?? true);
  }

  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Batal', style: 'cancel', onPress: () => resolve(false) },
        {
          text: confirmLabel,
          style: destructive ? 'destructive' : 'default',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
