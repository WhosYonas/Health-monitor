import { NotAuthenticatedPage } from "@/views/notAuthenitcatedPage";

interface NotAuthenticatedPagePresenterProps {
  userRole: string | null;
}

export const NotAuthenticatedPagePresenter = ({
  userRole,
}: NotAuthenticatedPagePresenterProps) => {
  return <NotAuthenticatedPage userRole={userRole} />;
};
