import React from "react";
import MoreMenu from "../../MoreMenu";
import Modal from "../../Modal";
import { ButtonSecondary } from "../../Button";
import useModal from "../../../hooks/useModal";
import BudgetTableCategory, { CategoryWithAmount } from "./BudgetTableCategory";

export type Table = {
  id: number;
  name: string;
  budget_categories: CategoryWithAmount[];
  amount: number;
  remaining: number;
  recurrence: string;
  start_date: string;
};

interface BudgetTableProps {
  table: Table;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export default function BudgetTable({
  table,
  onEdit,
  onDelete,
  children,
  ...props
}: BudgetTableProps) {
  const { activeModal, openModal, closeModal } = useModal();

  return (
    <div
      {...props}
      className="flex flex-col items-start gap-4 rounded-md border border-accent/10 p-4 text-left"
    >
      <table className="flex w-full flex-col items-center justify-between gap-4">
        <caption className="flex w-full flex-row items-center justify-between gap-2 rounded-md border border-accent/10 bg-accent/5 p-2">
          <h3 className="font-bold">{table.name}</h3>
          <div className="flex gap-2">
            <p className="text-sm font-bold">${table.amount}</p>
            <MoreMenu
              isDeletable
              onEdit={onEdit}
              onDelete={() => openModal("delete")}
            />
          </div>
        </caption>

        <tbody className="flex w-full flex-col gap-4 overflow-x-scroll text-sm md:overflow-auto">
          <tr className="grid w-[440px] grid-cols-4 justify-between gap-2 sm:w-full">
            <th
              scope="col"
              className="rounded-sm border border-accent/10 px-2 py-1"
            >
              Category
            </th>
            <th
              scope="col"
              className="rounded-sm border border-accent/10 px-2 py-1 text-right"
            >
              Budget
            </th>
            <th
              scope="col"
              className="rounded-sm border border-accent/10 px-2 py-1 text-right"
            >
              Spent
            </th>
            <th
              scope="col"
              className="rounded-sm border border-accent/10 px-2 py-1 text-right"
            >
              Remaining
            </th>
          </tr>

          {table.budget_categories.map((category: CategoryWithAmount) => (
            <BudgetTableCategory
              key={category.id}
              category={category}
              totalBudgetAmount={table.amount}
            />
          ))}
        </tbody>
      </table>

      {children}

      {activeModal === "delete" && (
        <Modal
          id="deleteBudgetModal"
          title="Delete budget"
          isOpen={activeModal === "delete"}
          handleClose={() => closeModal()}
        >
          <p>Are you sure you want to delete this budget?</p>

          <div className="flex flex-row items-center justify-end gap-2">
            <ButtonSecondary type="button" onClick={() => closeModal()}>
              Cancel
            </ButtonSecondary>

            <button
              type="button"
              className="w-fit rounded-md bg-red-700 px-6 py-3 text-white hover:bg-red-500"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}