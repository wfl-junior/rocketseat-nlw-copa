import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "native-base";
import { PlusCircle, SoccerBall } from "phosphor-react-native";
import { Platform } from "react-native";
import { FindPool } from "~/screens/FindPool";
import { NewPool } from "~/screens/NewPool";
import { PoolDetails } from "~/screens/PoolDetails";
import { Pools } from "~/screens/Pools";

const { Navigator, Screen } = createBottomTabNavigator();

interface AppRoutesProps {}

export const AppRoutes: React.FC<AppRoutesProps> = () => {
  const { colors, sizes, fontSizes, fonts } = useTheme();
  const iconSize = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          position: "absolute",
          height: 88,
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: "relative",
          top: Platform.OS === "android" ? -10 : 0,
        },
        tabBarLabelStyle: {
          fontFamily: (fonts as any).medium,
          fontSize: fontSizes.md,
        },
      }}
    >
      <Screen
        name="new-pool"
        component={NewPool}
        options={{
          tabBarIcon: ({ color }) => (
            <PlusCircle color={color} size={iconSize} />
          ),
          tabBarLabel: "Novo bolão",
        }}
      />

      <Screen
        name="pools"
        component={Pools}
        options={{
          tabBarIcon: ({ color }) => (
            <SoccerBall color={color} size={iconSize} />
          ),
          tabBarLabel: "Meus bolões",
        }}
      />

      <Screen
        name="find-pool"
        component={FindPool}
        options={{
          tabBarButton: () => null,
        }}
      />

      <Screen
        name="pool-details"
        component={PoolDetails}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
};
