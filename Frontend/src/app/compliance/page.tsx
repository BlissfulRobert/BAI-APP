/**
 * ==============================================================================
 * MAIN ROUTE PAGE: /compliance
 * Path: src/app/compliance/page.tsx
 * Description: Redirects root compliance portal access to the dashboard.
 * ==============================================================================
 */

import { redirect } from "next/navigation";

export default function CompliancePortalPage() {
  redirect("/compliance/dashboard");
}
