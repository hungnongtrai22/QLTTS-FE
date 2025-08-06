// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// _mock
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {  ICompanyItem } from 'src/types/user';
import { t } from 'i18next';

//
import CompanyNewEditForm from '../company-new-edit-form';

// ----------------------------------------------------------------------

export default function CompanyEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const [company, setCompany] = useState<ICompanyItem>();

  const handleGetCompanyById = useCallback(async () => {
    const {data} = await axios(`${process.env.REACT_APP_HOST_API}/api/company/${id}`);
    setCompany(data.company);
  },[id]);

  useEffect(()=>{
    handleGetCompanyById();
  },[handleGetCompanyById])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Chỉnh Sửa"
        links={[
          {
            name: t('dashboard') || "",
            href: paths.dashboard.root,
          },
          {
            name: 'Công ty',
            href: paths.dashboard.company.root,
          },
          { name: company?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {company && <CompanyNewEditForm currentCompany={company} />}
    </Container>
  );
}
