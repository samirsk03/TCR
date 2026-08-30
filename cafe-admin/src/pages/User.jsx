import { useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon,
  Search,
  RefreshCw,
  User,
  Phone,
  Calendar,
  Star,
  UserCheck,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/auth/users");

      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Users fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ----------------------------------------
  // STATS
  // ----------------------------------------

  const stats = useMemo(() => {
    const customers = users.filter(
      (user) => user.role === "customer"
    );

    const staff = users.filter(
      (user) => user.role === "staff"
    );

    const admins = users.filter(
      (user) => user.role === "admin"
    );

    const active = users.filter(
      (user) => user.isActive !== false
    );

    return {
      total: users.length,
      customers: customers.length,
      staff: staff.length,
      admins: admins.length,
      active: active.length,
    };
  }, [users]);

  // ----------------------------------------
  // FILTER
  // ----------------------------------------

  const filteredUsers = useMemo(() => {
    let data = [...users];

    if (roleFilter !== "all") {
      data = data.filter(
        (user) => user.role === roleFilter
      );
    }

    if (search.trim()) {
      const searchText = search.toLowerCase();

      data = data.filter((user) => {
        const name =
          user.name?.toLowerCase() || "";

        const phone =
          user.phone?.toLowerCase() || "";

        const employeeId =
          user.employeeId?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          phone.includes(searchText) ||
          employeeId.includes(searchText)
        );
      });
    }

    return data;
  }, [users, search, roleFilter]);

  // ----------------------------------------
  // ROLE BADGE
  // ----------------------------------------

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";

      case "staff":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <UsersIcon size={24} />
          </div>

          <div>

            <h1 className="text-3xl font-black text-gray-900">
              Users
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and view your TCR customers and staff
            </p>

          </div>

        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition disabled:opacity-50"
        >

          <RefreshCw
            size={18}
            className={
              loading ? "animate-spin" : ""
            }
          />

          Refresh

        </button>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <UsersIcon className="text-blue-600" />

          <p className="text-sm text-gray-500 mt-4">
            Total Users
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.total}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <User className="text-green-600" />

          <p className="text-sm text-gray-500 mt-4">
            Customers
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.customers}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <UserCheck className="text-blue-600" />

          <p className="text-sm text-gray-500 mt-4">
            Staff
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.staff}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <UserCheck className="text-purple-600" />

          <p className="text-sm text-gray-500 mt-4">
            Admins
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.admins}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <Star className="text-yellow-500 fill-yellow-400" />

          <p className="text-sm text-gray-500 mt-4">
            Active Users
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.active}
          </h2>

        </div>

      </div>

      {/* FILTERS */}

      <div className="bg-white rounded-2xl shadow-sm border p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search name, phone or employee ID..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-gray-400"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="px-5 py-3 rounded-xl border border-gray-200 bg-white font-medium outline-none"
          >

            <option value="all">
              All Users
            </option>

            <option value="customer">
              Customers
            </option>

            <option value="staff">
              Staff
            </option>

            <option value="admin">
              Admins
            </option>

          </select>

        </div>

      </div>

      {/* ERROR */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-center gap-3">

          <AlertCircle size={22} />

          <span className="font-medium">
            {error}
          </span>

        </div>

      )}

      {/* LOADING */}

      {loading ? (

        <div className="grid gap-5">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="h-36 bg-gray-200 rounded-2xl animate-pulse"
            />

          ))}

        </div>

      ) : filteredUsers.length === 0 ? (

        /* EMPTY */

        <div className="bg-white rounded-2xl border shadow-sm p-16 text-center">

          <UsersIcon
            size={60}
            className="mx-auto text-gray-300"
          />

          <h3 className="text-2xl font-black mt-5">
            No Users Found
          </h3>

          <p className="text-gray-500 mt-2">
            No users match your current filters.
          </p>

        </div>

      ) : (

        /* USERS */

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

          {/* DESKTOP TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Contact
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Role
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Reward Points
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Visits
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Joined
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* USER */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                          <User
                            size={19}
                            className="text-gray-500"
                          />

                        </div>

                        <div>

                          <p className="font-black text-gray-900">
                            {user.name}
                          </p>

                          {user.employeeId && (

                            <p className="text-xs text-gray-400 mt-1">
                              ID: {user.employeeId}
                            </p>

                          )}

                        </div>

                      </div>

                    </td>

                    {/* CONTACT */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-gray-600">

                        <Phone size={15} />

                        {user.phone}

                      </div>

                    </td>

                    {/* ROLE */}

                    <td className="px-6 py-5">

                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>

                    </td>

                    {/* POINTS */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 font-bold">

                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-400"
                        />

                        {user.rewardPoints || 0}

                      </div>

                    </td>

                    {/* VISITS */}

                    <td className="px-6 py-5 font-bold">

                      {user.visitCount || 0}

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${
                          user.isActive === false
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isActive === false
                          ? "Inactive"
                          : "Active"}
                      </span>

                    </td>

                    {/* JOINED */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-sm text-gray-500">

                        <Calendar size={15} />

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "-"}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default Users;