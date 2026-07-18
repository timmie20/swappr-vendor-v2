import { formatCurrency, formatDate } from "@/helpers/format";
import { OrderDetails } from "@/features/orders/types";

// Rendered hidden on screen and shown only in print media — the rest of
// the page is print:hidden, so this is the entire printed document.
export function PrintReceipt({ order }: { order: OrderDetails }) {
  return (
    <div className="hidden p-8 font-sans text-gray-900 print:block">
      {/* Branding */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Swappr</h1>
          <p className="mt-0.5 text-sm text-gray-500">Order Receipt</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{order.order_number}</p>
          <p className="mt-0.5 text-xs text-gray-400">
            {formatDate(order.created_at)?.full}
          </p>
        </div>
      </div>

      {/* Buyer */}
      <div className="mb-6">
        <h2 className="mb-2 text-xs font-medium tracking-widest text-gray-400 uppercase">
          Buyer
        </h2>
        <p className="text-sm font-medium">
          {order.buyer?.first_name} {order.buyer?.last_name}
        </p>
        <p className="text-sm text-gray-500">{order.buyer?.email}</p>
        <p className="text-sm text-gray-500">{order.contact_phone}</p>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h2 className="mb-3 text-xs font-medium tracking-widest text-gray-400 uppercase">
          Items
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-2 font-medium text-gray-500">Product</th>
              <th className="pb-2 text-center font-medium text-gray-500">
                Qty
              </th>
              <th className="pb-2 text-right font-medium text-gray-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2">
                  <p className="font-medium">{item.product_name}</p>
                  {(item.color || item.storage) && (
                    <p className="text-xs text-gray-400">
                      {[item.color, item.storage ? `${item.storage}GB` : null]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  )}
                </td>
                <td className="py-2 text-center text-gray-500">
                  {item.quantity}
                </td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td
                colSpan={2}
                className="pt-3 text-sm font-semibold text-gray-900"
              >
                Total
              </td>
              <td className="pt-3 text-right text-sm font-bold">
                {formatCurrency(order.total_amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment */}
      <div className="border-t border-gray-100 pt-4 text-sm">
        <p className="text-gray-500">
          Payment status:{" "}
          <span className="font-medium text-gray-900">
            {order.payment_status}
          </span>
        </p>
        {order.transaction_reference && (
          <p className="mt-1 text-gray-500">
            Reference:{" "}
            <span className="font-mono text-xs">
              {order.transaction_reference}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
