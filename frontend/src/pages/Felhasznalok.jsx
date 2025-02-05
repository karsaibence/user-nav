import React from 'react'
import { Table } from 'react-bootstrap';
import UsersTableRow from '../components/tables/UsersTableRow';
import useAdminContext from '../contexts/AdminContext';

const Felhasznalok = () => {
  const { users, role } = useAdminContext();

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
              users.map( ( e, i ) => {
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