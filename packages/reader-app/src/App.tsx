import React from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { PublicationListPage } from '@/pages/PublicationListPage';
import { PublicationDetailPage } from '@/pages/PublicationDetailPage';

export const App: React.FC = () => (
  <Routes>
    <Route path="/publications" element={<PublicationListPage />} />
    <Route path="/publications/:handle" element={<PublicationDetailPage />} />
    <Route path="*" element={<Navigate to="/publications" />} />
  </Routes>
);
