import { TrendingUp, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';

interface NotificationBannerProps {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
}

export function NotificationBanner({ type, title, message }: NotificationBannerProps) {
  const configs = {
    success: {
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-500',
      textColor: 'text-gray-900',
      messageColor: 'text-gray-700',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-500',
      textColor: 'text-gray-900',
      messageColor: 'text-gray-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-500',
      textColor: 'text-gray-900',
      messageColor: 'text-gray-700',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-500',
      textColor: 'text-gray-900',
      messageColor: 'text-gray-700',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <div className="p-4 flex items-start gap-4">
        <div className={`${config.iconBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className={`${config.textColor} mb-1`}>{title}</h3>
          <p className={config.messageColor}>{message}</p>
        </div>
      </div>
    </Card>
  );
}
