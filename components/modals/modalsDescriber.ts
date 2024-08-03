import { ExampleModal, ExampleModalDescription } from "@/app/ExampleModal";

export interface ModalDescription {
  name: string;
  state: any;
  promiseBased: boolean;
  component: React.FC<any>;
}

let modals: { [name: string]: ModalDescription } = {};

const registerModal = (modal: any, description: any) => {
  const desc = description;

  modals[desc.name] = {
    name: desc.name,
    promiseBased: desc.promiseBased,
    state: {
      ...desc.defaultProps,
    },
    component: modal,
  };
};

registerModal(ExampleModal, ExampleModalDescription);

export { modals };
