import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/AdminAuth";
import AdminCRM from "./pages/AdminCRM";
import AdminSubmission from "./pages/AdminSubmission";
import AdminSettings from "./pages/AdminSettings";
import RideshareAbuse from "./pages/RideshareAbuse";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rideshare-abuse" element={<RideshareAbuse />} />
          <Route path="/admin/login" element={<AdminAuth />} />
          <Route path="/admin" element={<AdminCRM />} />
          <Route path="/admin/rideshare" element={<AdminCRM presetClaim="rideshare" />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/:id" element={<AdminSubmission />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
