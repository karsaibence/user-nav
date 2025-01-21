import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { myAxios } from "../../api/Axios";
import TableRow from "./TableRow";
import "./roletables.css"

const Tables = (props) => {
  const [items, setItems] = useState(props.lista); // Kezdetben üres tömb

  useEffect(() => {
    setItems(props.lista); // Frissítjük a state-et, amikor a lista változik
  }, [props.lista]);

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    // Ha nincs érvényes cél, ne csinálj semmit
    if (!destination) return;

    const reorderedItems = Array.from(props.lista); // Átrendezzük az elemeket
    const [removed] = reorderedItems.splice(source.index, 1); // Kivesszük az elemet
    reorderedItems.splice(destination.index, 0, removed); // Beszúrjuk az új helyre

    // Frissítjük az elemeket a state-ben
    setItems(reorderedItems);

    // Az új sorrendet globálisan is frissítjük
    props.onUpdateNavOrder(props.nev, reorderedItems); // Továbbítjuk a frissített sorrendet a szülőnek

    // Küldjük el az új sorrendet a backendnek
    try {
      const response = await myAxios.put("/update-nav", {
        items: reorderedItems,
      });
      console.log("Updated order (response):", response.data);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  console.log(items);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
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
                <th>{props.nev}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e, i) => {
                if (e.role_name === props.nev)
                  return (
                    <Draggable key={e.id} draggableId={String(e.id)} index={i}>
                      {(provided) => (
                        <>
                          <TableRow provided={provided} e={e}/>
                          {provided.placeholder} {/* Helyfoglaló hozzáadása */}
                        </>
                      )}
                    </Draggable>
                  );
              })}
            </tbody>
          </Table>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Tables;
