import { HeaderPage } from '@/views/headerPage'

export function HeaderPagePresenter({ children }: { children: React.ReactNode }) {
  return (
    <HeaderPage>
      {children}
    </HeaderPage>
  );
}