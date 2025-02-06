import React, { useState, useEffect } from "react";
import Tables from "../tables/Tables"; // Táblázatok kezelése
import { Table } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { myAxios } from "../../api/Axios"; // Backend kommunikációhoz
import useAdminContext from "../../contexts/AdminContext";
import "./dragndrop.css";

const NavElemek = () => {
  const { role, navRoleInfo, navs, fetchNavRoleInfo } = useAdminContext();
  const [globalItems, setGlobalItems] = useState({});

  // Frissítjük a globalItems állapotot a szerepkörökhöz tartozó menüpontokkal
  useEffect(() => {
    const itemsByRole = role.reduce((acc, e) => {
      const filteredNavItems = navRoleInfo.filter(
        (item) => item.role_name === e.megnevezes
      );
      acc[e.megnevezes] = filteredNavItems;
      return acc;
    }, {});

    setGlobalItems((prevItems) => ({
      ...prevItems,
      ...itemsByRole,
    }));
  }, [role, navRoleInfo]);

  // Menüpontok hozzáadása vagy eltávolítása a szerepkörökhöz
  const handleMoveMenuItem = async (menuItem, roleName, isAdding, id) => {
    const updatedMenuItem = { ...menuItem, nav_id: menuItem.id };

    try {
      // Ha hozzáadjuk a menüpontot a szerepkörhöz
      if (isAdding) {
        const checkResponse = await myAxios.post(
          "/check-nav-assigned-to-role",
          {
            nav_id: updatedMenuItem.nav_id,
            role_name: roleName,
          }
        );

        // Ha már létezik a menüpont, ne csináljunk semmit
        if (checkResponse.data.exists) return;

        // Hozzáadjuk a menüpontot a szerepkörhöz
        await myAxios.post("/add-nav-to-role", {
          nav_id: updatedMenuItem.nav_id,
          role_name: roleName,
        });
      } else {
        // Ha eltávolítjuk a menüpontot a szerepkörből
        try {
          const response = await myAxios.delete(`/remove-nav-from-role/${id}`); // Itt az id-t használjuk
          console.log("Sikeres törlés:", response);
        } catch (error) {
          console.log("sikertelen törlés: ", error);
        }
      }

      // UI frissítése
      setGlobalItems((prevItems) => {
        const updatedGlobalItems = { ...prevItems };
        const roleItems = updatedGlobalItems[roleName] || [];

        if (isAdding) {
          roleItems.push(updatedMenuItem); // Hozzáadjuk a menüpontot
        } else {
          const index = roleItems.findIndex(
            (item) => item.id === updatedMenuItem.id
          );
          if (index > -1) roleItems.splice(index, 1); // Eltávolítjuk a menüpontot
        }

        updatedGlobalItems[roleName] = roleItems;
        return updatedGlobalItems;
      });

      await fetchNavRoleInfo(); // Backend adatfrissítés
    } catch (error) {
      console.error("Error handling menu item:", error);
    }
  };

  // Drag-and-drop eseménykezelő
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    // Ha nincs érvényes célpont, nem csinálunk semmit
    if (!destination) return;

    const sourceRoleName = source.droppableId; // A forrás szerepkör (droppableId)
    const destinationRoleName = destination.droppableId; // A cél szerepkör (droppableId)

    const menuItem = navs[source.index]; // A menüpont, amit áthúztak
    if (!menuItem) return;

    console.log("Source role:", sourceRoleName);
    console.log("Destination role:", destinationRoleName);

    // Ha a destination a "menuList", akkor azt jelenti, hogy vissza akarjuk helyezni a menüt a "menuList"-be
    if (destinationRoleName === "menuList") {
      console.log("Moving menuItem back to menuList");
      handleMoveMenuItem(menuItem, sourceRoleName, false, result.draggableId); // Eltávolítjuk a szerepkörhöz tartozó táblázatból
    } else if (sourceRoleName === "menuList") {
      // Ha a source a "menuList", akkor hozzáadjuk a menüt a megfelelő szerepkörhöz
      console.log("Moving menuItem to role:", destinationRoleName);
      handleMoveMenuItem(menuItem, destinationRoleName, true); // Hozzáadjuk a megfelelő szerepkörhöz
    } else if (
      !globalItems[sourceRoleName] ||
      !globalItems[destinationRoleName]
    ) {
      // Ellenőrizzük, hogy léteznek-e a megfelelő szerepkörök a globalItems-ben
      console.error(
        `Invalid droppableId: ${sourceRoleName} or ${destinationRoleName}`
      );
      return;
    } else {
      // Átrendezzük a menüpontokat az új sorrend szerint
      console.log("Moving menuItem within role:", sourceRoleName);
      const reorderedItems = Array.from(globalItems[sourceRoleName] || []); // Használj [] alapértelmezett értéket
      const [removed] = reorderedItems.splice(source.index, 1); // Eltávolítjuk a menüpontot
      reorderedItems.splice(destination.index, 0, removed); // Beszúrjuk az új helyre

      // Az új sorrend frissítése a frontenden
      setGlobalItems((prevItems) => {
        const updatedGlobalItems = { ...prevItems };
        updatedGlobalItems[sourceRoleName] = reorderedItems;
        return updatedGlobalItems;
      });

      // Az új sorrend elküldése a backend felé
      try {
        const updatedMenuItems = reorderedItems.map((item, index) => ({
          id: item.id, // Az id kulcsot megtartjuk
          sorszam: index + 1, // A sorszamot az index alapján frissítjük (1-től kezdődik)
        }));

        const response = await myAxios.put("/update-nav", {
          role_name: sourceRoleName,
          items: updatedMenuItems, // Az új sorrend ID és sorszam kulcsokkal
        });
        console.log("Sorrend frissítve:", response.data);
      } catch (error) {
        console.error("Hiba a sorrend frissítése közben:", error);
      }
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
                    <Draggable
                      key={e.id}
                      draggableId={`menu-${e.id}`}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <>
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style, // Alap stílusok, amelyeket a drag-and-drop rendszer ad
                              height: "50px",
                              width: "300px",
                              padding: "fit-parent",
                              cursor: snapshot.isDragging ? "grabbing" : "grab", // Különböző kurzor húzás közben
                              zIndex: snapshot.isDragging ? 1000 : 1, // Ha húzod, a legelső elem legyen
                              boxShadow: snapshot.isDragging
                                ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                                : "none", // Árnyék a húzott elem körül
                            }}
                          >
                            <td>{e.megnevezes}</td>
                          </tr>
                        </>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
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
