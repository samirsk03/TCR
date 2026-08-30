export default function SectionCard({
    title,
    children,
    action,
}) {
    return (
        <div className="bg-white rounded-3xl shadow-md border border-gray-100">

            <div className="flex items-center justify-between px-6 py-5 border-b">

                <h2 className="text-xl font-semibold">
                    {title}
                </h2>

                {action}

            </div>

            <div className="p-6">

                {children}

            </div>

        </div>
    );
}