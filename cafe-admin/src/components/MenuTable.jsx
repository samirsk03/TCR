import {
  Pencil,
  Trash2,
} from "lucide-react";

export default function MenuTable({
  menu = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Image
              </th>

              <th className="px-4 py-3 text-left">
                Name
              </th>

              <th className="px-4 py-3 text-left">
                Category
              </th>

              <th className="px-4 py-3 text-left">
                Food
              </th>

              <th className="px-4 py-3 text-left">
                Price
              </th>

              <th className="px-4 py-3 text-left">
                Variants
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {menu.length === 0 ? (
              <tr>

                <td
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
                >
                  No Menu Items Found
                </td>

              </tr>
            ) : (
              menu.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >

                  {/* Image */}

                  <td className="px-4 py-3">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}

                  </td>

                  {/* Name */}

                  <td className="px-4 py-3 font-semibold">
                    {item.name}
                  </td>

                  {/* Category */}

                  <td className="px-4 py-3">
                    {item.category}
                  </td>

                  {/* Food */}

                  <td className="px-4 py-3 capitalize">
                    {item.foodType}
                  </td>

                  {/* Price */}

                  <td className="px-4 py-3">

                    {item.variants &&
                    item.variants.length > 0
                      ? `₹${Math.min(
                          ...item.variants.map(
                            (v) => v.price
                          )
                        )} - ₹${Math.max(
                          ...item.variants.map(
                            (v) => v.price
                          )
                        )}`
                      : `₹${item.price}`}

                  </td>

                  {/* Variants */}

                  <td className="px-4 py-3">

                    {item.variants?.length || 0}

                  </td>

                  {/* Status */}

                  <td className="px-4 py-3">

                    {item.isAvailable ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        Available
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                        Unavailable
                      </span>
                    )}

                  </td>

                  {/* Actions */}

                  <td className="px-4 py-3">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}