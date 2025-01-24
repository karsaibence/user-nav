import React, { useEffect, useState } from 'react'
import useAuthContext from '../contexts/AuthContext'
import { Table } from 'react-bootstrap';
import UsersTableRow from '../components/tables/UsersTableRow';
import { myAxios } from '../api/Axios';

const Felhasznalok = () => {
  const { users, role } = useAuthContext();
  const [ userek, setUserek ] = useState( [] ); // A felhasználók tárolása

  const getUsers = async () => {
    const response = await myAxios.get( '/users' ); // vagy más endpoint, ami a felhasználókat adja vissza
    setUserek( response.data ); // A felhasználók frissítése
  };

  useEffect( () => {
    getUsers();
  }, [] );

  return (
    <div>
      <Table
        className="user-table"
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>Felhasználók</th>
            <th>Jogosultság</th>
          </tr>
        </thead>
        <tbody>
          {
            users ?
              userek.map( ( e, i ) => {
                return <UsersTableRow role={role} e={e} key={i} />
              } ) : (
                <tr>
                  <td>loading</td>
                </tr>
              )
          }
        </tbody>
      </Table>
    </div >
  )
}

export default Felhasznalok