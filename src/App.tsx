import {GenerateColumn, Table} from "./table";
import {model} from "./table/model.ts";
import {observer} from "mobx-react-lite";

export const App = observer(() => {

  if(model.rows.length > 0) {
    return <Table />
  }

  return <GenerateColumn />
})
