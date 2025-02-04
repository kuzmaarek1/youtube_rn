import Feather from "react-native-vector-icons/Feather";

export const icon: Record<string, (props: any) => JSX.Element> = {
  "downloand-video": (props) => (
    <Feather name="download" size={24} {...props} />
  ),
  "segment-video": (props) => <Feather name="film" size={24} {...props} />,
};
