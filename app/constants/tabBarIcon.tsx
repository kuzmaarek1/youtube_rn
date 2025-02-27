import Feather from "react-native-vector-icons/Feather";

export const icon: Record<string, (props: any) => JSX.Element> = {
  "download-video": (props) => <Feather name="download" size={24} {...props} />,
  "segment-video": (props) => <Feather name="film" size={24} {...props} />,
  "watch-video": (props) => <Feather name="play-circle" size={24} {...props} />,
};
