import { Table } from "react-bootstrap";
import { ReactNode } from "react";
import AccountNavigation from "./navigation";
import "../styles.css";

export default function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz">
      <Table borderless>
        <tbody>
          <tr>
            <td valign="top">
              <AccountNavigation/>
            </td>
            <td valign="top" width={"100%"}>
              <div className="flex-fill p-3">
                {children}
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
