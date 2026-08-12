import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
}) {
    return (

        <motion.div
            whileHover={{
                y: -5,
            }}
            className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
        >

            <div className="flex justify-between items-start">

                <div>

                    <p className="text-gray-500 font-medium">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {value}
                    </h2>

                    <div className="flex items-center mt-5 text-green-600 text-sm font-medium">

                        <ArrowUpRight
                            size={18}
                            className="mr-1"
                        />

                        Live

                    </div>

                </div>

                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                        background: color,
                    }}
                >

                    <Icon
                        size={30}
                        color="white"
                    />

                </div>

            </div>

        </motion.div>

    );
}