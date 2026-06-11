import { AuthWrapper } from "@widgets/wrappers/auth-wrapper";
import { CommonWrapper } from "@widgets/wrappers/common-wrapper";

type RootWrapperProps = {
  children: React.ReactNode;
};

export function RootWrapper({ children }: RootWrapperProps): React.JSX.Element {
  return (
    <CommonWrapper>
      <AuthWrapper>{children}</AuthWrapper>
    </CommonWrapper>
  );
}
