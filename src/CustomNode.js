import { Handle, Position, useStore } from "reactflow";
import DragHandlerIcon from "@atlaskit/icon/glyph/drag-handler";
import DeleteIcon from "@atlaskit/icon/glyph/editor/remove";
import EditIcon from "@atlaskit/icon/glyph/edit";

const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function CustomNode({ id }) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };
  const label = isTarget ? "Target" : "Create company email";

  return (
    <div>
      <div className="customNode">
        <div
          className="customNodeBody"
          style={{
            borderStyle: isTarget ? "dashed" : "solid",
          }}
        >
          <Handle
            className="targetHandle"
            style={{ zIndex: 2 }}
            position={Position.Right}
            type="source"
          />
          <Handle
            className="targetHandle"
            style={targetHandleStyle}
            position={Position.Left}
            type="target"
          />
          {label}
          <div className="edit-delete-icon">
            <EditIcon />
            <DeleteIcon />
          </div>
        </div>
      </div>
      <div className="drag-icon">
        <DragHandlerIcon />
      </div>
    </div>
  );
}
