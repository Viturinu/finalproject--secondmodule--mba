import { Profile02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

export function CustomTooltip({
    active,
    payload,
    label,
}: TooltipProps<ValueType, NameType>) {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
            <p className="text-xs font-bold text-gray-600">
                {String(data.pv).toUpperCase()} {/* Isso seria: "17 de Julho" */}
            </p>
            <p className="flex flex-row text-xs text-gray-600 mt-3 gap-2">
                <HugeiconsIcon icon={Profile02Icon} height={12} width={12} className="text-orange-base" />
                {data.uv === 1 ? `${data.uv} visitante` : `${data.uv} visitantes`}
            </p>
        </div>
    );
};
