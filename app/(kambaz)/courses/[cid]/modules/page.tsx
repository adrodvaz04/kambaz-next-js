"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import * as client from "../../client";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./modulesControls";
import { editModule, setModules } from "./reducer";

export default function Modules() {
  const { cid } = useParams();
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const [moduleName, setModuleName] = useState<string>("");
  const dispatch = useDispatch();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any | null;

  const isFaculty = currentUser ? currentUser.role === "FACULTY" : false;

  const onCreateModuleForCourse = async () => {
    if (!cid || Array.isArray(cid)) {
      console.log("module not created: cid", cid);
      return;
    }

    const newModule = { name: moduleName, course: cid };
    const createdModule = await client.createModuleForCourse(cid, newModule);
    dispatch(setModules([...modules, createdModule]));
  };

  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };

  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(cid as string, moduleId);
    dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
  };

  const onUpdateModule = async (module: any) => {
    await client.updateModule(cid as string, module);
    const newModules = modules.map((m: any) =>
      m._id === module._id ? module : m,
    );
    dispatch(setModules(newModules));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div>
      <div className="size-fit">
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={onCreateModuleForCourse}
        />
      </div>
      <br />
      <br />
      <br />
      <ListGroup className="rounded-0 mt-3" id="wd-modules">
        {modules.map((module: any) => (
          <ListGroupItem
            className="wd-module p-0 mb-5 fs-5 border-gray"
            key={module.name}
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  onChange={(e) => setModuleName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateModule({
                        ...module,
                        name: moduleName,
                        editing: false,
                      });
                    }
                  }}
                  defaultValue={module.name}
                />
              )}
              <ModuleControlButtons
                show={isFaculty}
                moduleId={module._id}
                deleteModule={(moduleId: string) => onRemoveModule(moduleId)}
                editModule={() => onUpdateModule(module)}
              />{" "}
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroupItem
                    className="wd-lesson p-3 ps-1"
                    key={lesson.name}
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}{" "}
                    <LessonControlButtons />{" "}
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
