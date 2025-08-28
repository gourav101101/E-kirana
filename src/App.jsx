import OrderConfirmationPage from './pages/OrderConfirmationPage';
// Add ErrorBoundary import if you want to use it
import ErrorBoundary from './components/ErrorBoundary';

<Routes>
  {/* ...existing routes... */}
  {/* Wrap with ErrorBoundary if you want to catch errors */}
  <Route
    path="/order-confirmation/:id"
    element={
      <ErrorBoundary>
        <OrderConfirmationPage />
      </ErrorBoundary>
    }
  />
  {/* ...existing routes... */}
</Routes>
