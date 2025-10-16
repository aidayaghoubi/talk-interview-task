import { IDevice } from "../store/type";
import { ErrorIcon } from "../svgs";

interface ISettingDropdownProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: IDevice[];
  status: boolean;
  error?: string;
}

export const SettingDropdown = ({ label, value, onChange, options, status, error }: ISettingDropdownProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        {label}
        {!status && (
          <div className="relative group">
            <ErrorIcon className="text-red-500 w-4 h-4" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {error}
            </div>
          </div>
        )}
      </h3>
      <select
        value={value || ""}
        onChange={onChange}
        className="w-full bg-gray-100 rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-ellipsis overflow-hidden whitespace-nowrap"
        title={options.find(device => device.deviceId === value)?.label || "Select " + label}
      >
        {options.map((device: IDevice) => (
          <option className="max-w-[150px] text-ellipsis overflow-hidden whitespace-nowrap" key={device.deviceId} value={device.deviceId} title={device.label}>
            <option key={device.deviceId} value={device.deviceId}>
              {device.label.length > 50 ? device.label.slice(0, 50) + "..." : device.label}
            </option>
          </option>
        ))}
      </select>
    </div>
  );
}