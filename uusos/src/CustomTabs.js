import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Histogram from './Histogram';

import { BarChart } from '@mui/x-charts/BarChart';
import MiaryTendencji from './MiaryTendencji';
import Korelacja from './Korelacja';
import Porownywarka from './Porownywarka';
import Summary from './Summary';
import Generator from './Generator';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function CustomTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '1000px', marginTop: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Lista" {...a11yProps(0)} />
          <Tab label="Histogram ocen" {...a11yProps(1)} />
          <Tab label="Miary tendencji" {...a11yProps(2)} />
          <Tab label="Korelacja Pearsona" {...a11yProps(3)} />
          <Tab label="Analiza porówanwcza" {...a11yProps(4)} />
          <Tab label="Generator" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Summary />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Histogram />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <MiaryTendencji />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Korelacja />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Porownywarka />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <Generator />
      </CustomTabPanel>
    </Box>
  );
}