import React, { useState, useEffect } from "react";
import Tables from "../tables/Tables";
import useAuthContext from "../../contexts/AuthContext";
import { Table } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { myAxios } from "../../api/Axios"; // Backend kommunikációhoz

const NavElemek = () => {
  const { role, navRoleInfo, navs } = useAuthContext();

  const [globalItems, setGlobalItems] = useState({});

  // A navRoleInfo adatok szűrése és feltöltése a globalItems-ba
  useEffect(() => {
    const itemsByRole = role.reduce((acc, e) => {
      // Az adott role-hoz tartozó navRoleInfo szűrése
      const filteredNavItems = navRoleInfo.filter(
        (item) => item.role_name === e.megnevezes
      );
      acc[e.megnevezes] = filteredNavItems;
      return acc;
    }, {});

    setGlobalItems(itemsByRole);
  }, [role, navRoleInfo]);

  const handleMoveMenuItem = async (menuItem, roleName) => {
    // Ellenőrizzük, hogy a menuItem tartalmazza a szükséges adatokat
    if (
      !menuItem ||
      !menuItem.id ||
      !menuItem.megnevezes ||
      !menuItem.url ||
      !roleName
    ) {
      console.error("Invalid menuItem or missing data", menuItem);
      return;
    }

    // Biztosítjuk, hogy a menuItem tartalmazza a nav_id-t
    const updatedMenuItem = {
      ...menuItem,
      nav_id: menuItem.id, // A nav_id-t a menuItem id-jéből hozzuk létre
    };

    console.log("Menu item before moving:", updatedMenuItem); // Kiíratjuk a menuItem-t, hogy lássuk az adatokat

    // Először ellenőrizzük, hogy a menüpont már hozzá van-e rendelve a szerepkörhöz
    try {
      const checkResponse = await myAxios.post("/check-nav-assigned-to-role", {
        nav_id: updatedMenuItem.nav_id,
        role_name: roleName,
      });

      if (checkResponse.data.exists) {
        console.log("This menu item is already assigned to the role.");
        return; // Ha már létezik a kapcsolat, nem végezzük el a mentést
      }
    } catch (error) {
      console.error("Error checking if menu item is assigned:", error);
      return;
    }

    // Az állapot frissítése a globalItems-ban
    setGlobalItems((prevItems) => {
      const updatedGlobalItems = { ...prevItems };

      if (!updatedGlobalItems[roleName]) {
        updatedGlobalItems[roleName] = [];
      }

      updatedGlobalItems[roleName].push(updatedMenuItem);

      return updatedGlobalItems;
    });

    // Backend frissítése
    try {
      const response = await myAxios.post("/add-nav-to-role", {
        nav_id: updatedMenuItem.nav_id, // nav_id
        role_name: roleName, // role_name
      });
      console.log("Menu item added to role:", response.data);
    } catch (error) {
      console.error("Error adding menu item to role:", error);
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return; // Ha nincs érvényes cél, nem csinálunk semmit

    // Ellenőrizzük, hogy létezik-e az index a navs tömbben
    const menuItem = navs[source.index];

    // Ha nincs, akkor hibát jelezünk és kilépünk
    if (!menuItem) {
      console.error("Menu item not found at index:", source.index);
      return;
    }

    console.log("Menu item:", menuItem); // Ekkor már biztosan nem undefined!

    // Ha a menüpontot egy role táblázatba mozgatták, áthelyezzük
    if (destination.droppableId !== "menuList") {
      handleMoveMenuItem(menuItem, destination.droppableId);
    }
  };

  return (
    <div className="menu-management">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="role-tables">
          {role.map((e) => (
            <Droppable droppableId={e.megnevezes} key={e.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Tables
                    nev={e.megnevezes}
                    lista={globalItems[e.megnevezes] || []}
                    key={e.id}
                    onUpdateNavOrder={(roleName, updatedItems) => {
                      setGlobalItems((prevItems) => {
                        const updatedGlobalItems = { ...prevItems };
                        updatedGlobalItems[roleName] = updatedItems;
                        return updatedGlobalItems;
                      });
                    }}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>

        <div className="menu-management-nav-list">
          <Droppable droppableId="menuList">
            {(provided) => (
              <Table
                className="table"
                striped
                bordered
                hover
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <thead>
                  <tr>
                    <th>Menüpontok</th>
                  </tr>
                </thead>
                <tbody>
                  {navs.map((e, i) => (
                    <Draggable key={e.id} draggableId={String(e.id)} index={i}>
                      {(provided) => (
                        <>
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td>{e.megnevezes}</td>
                          </tr>
                          {provided.placeholder}
                        </>
                      )}
                    </Draggable>
                  ))}
                </tbody>
              </Table>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default NavElemek;
