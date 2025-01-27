import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

export default function FlowbitAlertError({ msg }: { msg: string }) {
  return (
    <Alert className="m-1" color="failure" icon={HiInformationCircle}>
      {msg}
    </Alert>
  );
}
