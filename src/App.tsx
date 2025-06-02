import {GenerateColumn, Table} from "./table";
import {model} from "./table/model.ts";
import {observer} from "mobx-react-lite";
import {useDisplayEvent} from "./display/model.ts";

export const App = observer(() => {

  useDisplayEvent()

  if(model.rows.length > 0) {
    return <Table />
  }

  return <GenerateColumn />
})
