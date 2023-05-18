import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { xulyRoutes, privateRoutes, publicRoutes } from '~/routes';
import { DefaultLayout } from '~/components/Layout';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollToTop } from "~/components/scrollToTop";


function App() {
  const user = useSelector(state => state.user.user);
  const admin = useSelector(state => state.admin.admin);
  const [routerArr, setRouterArr] = useState()
  useEffect(() => {
    setRouterArr(privateRoutes())
    console.log(routerArr)
  }, [user, admin])
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          {routerArr && routerArr.length > 0 && routerArr.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return <Route key={index} path={route.path} element={<Layout><Page /></Layout>} />

          })}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
