import React, { useState } from "react";
import Tables from "../tables/Tables";
import useAuthContext from "../../contexts/AuthContext";
import { Table } from "react-bootstrap";

const NavElemek = () => {
  const { role, navRoleInfo, navs } = useAuthContext();

  const [globalItems, setGlobalItems] = useState({}); // Minden role_name-hez tartozó lista

  const handleUpdateNavOrder = (roleName, updatedItems) => {
    setGlobalItems((prevItems) => {
      const updatedGlobalItems = { ...prevItems };
      updatedGlobalItems[roleName] = updatedItems; // Az adott role_name táblázatának frissítése
      return updatedGlobalItems;
    });
  };

  console.log(role);
  return (
    <div className="menu-management">
      <div className="role-tables">
        {role.map((e) => {
          return (
            <Tables
              nev={e.megnevezes}
              lista={globalItems[e.megnevezes] || navRoleInfo}
              key={e.id}
              onUpdateNavOrder={handleUpdateNavOrder}
            />
          );
        })}
      </div>

      <div className="menu-management-nav-list">
        <Table className="table" striped bordered hover>
          <thead>
            <tr>
              <th>Menüpontok</th>
            </tr>
          </thead>
          <tbody>
            {navs.map((e, i) => {
              return (
                <tr>
                  <td>{e.megnevezes}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default NavElemek;
