import React, { useEffect } from 'react'
import Tables from '../tables/Tables'
import useAuthContext from '../../contexts/AuthContext';


const NavElemek = () => {
  const { role, user, getRoles, navsByRole, navRoleInfo, getNavItemsWithRoles } = useAuthContext();

  useEffect( () => {
    getRoles();
    getNavItemsWithRoles();
  }, [ user ] );



  return (
    <div>
      {
        role.map( ( e ) => {
          return <Tables nev={e.megnevezes} itmes={navRoleInfo} lista={navsByRole} key={e.id} />
        } )
      }
    </div>
  )
}

export default NavElemek