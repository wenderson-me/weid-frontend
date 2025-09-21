import React, { useState, useEffect } from 'react';
import { FiX, FiClock, FiCheck, FiTrash2, FiFilter } from 'react-icons/fi';
import notificationService from '../../services/notificationService';

const NotificationsMenu = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [filter, setFilter] = useState('all');

  const loadNotifications = async (page = 1, isRead = null) => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page,
        limit: pagination.limit
      };

      if (isRead !== null) {
        filters.isRead = isRead;
      }

      const data = await notificationService.getNotifications(filters);

      setNotifications(data.notifications || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 10,
        total: data.total || 0,
        totalPages: data.totalPages || 0
      });
    } catch (err) {
      setError(err.message || 'Erro ao carregar notificações');
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const isRead = filter === 'read' ? true : filter === 'unread' ? false : null;
      loadNotifications(1, isRead);
    }
  }, [isOpen, filter]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const isRead = filter === 'read' ? true : filter === 'unread' ? false : null;
      loadNotifications(pagination.page, isRead);
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, filter, pagination.page]);

  const filteredNotifications = notifications;

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
      setError('Erro ao marcar notificação como lida');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err);
      setError('Erro ao marcar todas as notificações como lidas');
    }
  };

  const removeNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification._id !== id));
    } catch (err) {
      console.error('Erro ao remover notificação:', err);
      setError('Erro ao remover notificação');
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-3 h-3 rounded-full flex-shrink-0 mt-1";
    switch (type) {
      case 'task':
        return <div className={`${iconClass} bg-blue-500`}></div>;
      case 'completion':
        return <div className={`${iconClass} bg-green-500`}></div>;
      case 'reminder':
        return <div className={`${iconClass} bg-orange-500`}></div>;
      case 'comment':
        return <div className={`${iconClass} bg-purple-500`}></div>;
      case 'system':
        return <div className={`${iconClass} bg-gray-500`}></div>;
      default:
        return <div className={`${iconClass} bg-gray-400`}></div>;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Menu de Notificações */}
      <div className="fixed inset-y-0 right-0 w-96 z-50 transform transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)'
        }}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Notificações
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {unreadCount} não lidas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--hover-bg)',
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--accent-danger)'
              e.target.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--hover-bg)'
              e.target.style.color = 'var(--text-secondary)'
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Filtros e Ações */}
        <div className="p-4 border-b space-y-3" style={{ borderColor: 'var(--border-color)' }}>
          {/* Filtros */}
          <div className="flex space-x-2">
            {['all', 'unread', 'read'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => handleFilterChange(filterType)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === filterType ? 'shadow-sm' : ''
                }`}
                style={{
                  backgroundColor: filter === filterType ? 'var(--accent-primary)' : 'var(--hover-bg)',
                  color: filter === filterType ? 'white' : 'var(--text-secondary)'
                }}
              >
                {filterType === 'all' ? 'Todas' : filterType === 'unread' ? 'Não lidas' : 'Lidas'}
              </button>
            ))}
          </div>

          {/* Ações */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full"
              style={{
                backgroundColor: 'var(--hover-bg)',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-primary)'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--hover-bg)'
                e.target.style.color = 'var(--text-secondary)'
              }}
            >
              <FiCheck size={16} />
              <span>Marcar todas como lidas</span>
            </button>
          )}
        </div>

        {/* Lista de Notificações */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-4"
                style={{ borderColor: 'var(--accent-primary)' }}></div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Carregando notificações...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-danger-light)' }}>
                <FiX size={24} style={{ color: 'var(--accent-danger)' }} />
              </div>
              <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Erro ao carregar
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                {error}
              </p>
              <button
                onClick={() => loadNotifications(1, filter === 'read' ? true : filter === 'unread' ? false : null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white'
                }}
              >
                Tentar novamente
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--hover-bg)' }}>
                <FiCheck size={24} style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Nenhuma notificação
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {filter === 'unread' ? 'Todas as notificações foram lidas' : 'Você está em dia!'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 rounded-xl transition-all duration-200 group relative ${
                    !notification.isRead ? 'border-l-4' : ''
                  }`}
                  style={{
                    backgroundColor: !notification.isRead ? 'var(--hover-bg)' : 'transparent',
                    borderLeftColor: !notification.isRead ? 'var(--accent-primary)' : 'transparent'
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(notification.type)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-medium text-sm leading-5 ${
                          !notification.isRead ? 'font-semibold' : ''
                        }`} style={{ color: 'var(--text-primary)' }}>
                          {notification.title}
                        </h4>

                        {/* Ações */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-1 rounded transition-colors duration-200"
                              style={{ color: 'var(--text-tertiary)' }}
                              onMouseEnter={(e) => {
                                e.target.style.color = 'var(--accent-primary)'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.color = 'var(--text-tertiary)'
                              }}
                              title="Marcar como lida"
                            >
                              <FiCheck size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification._id)}
                            className="p-1 rounded transition-colors duration-200"
                            style={{ color: 'var(--text-tertiary)' }}
                            onMouseEnter={(e) => {
                              e.target.style.color = 'var(--accent-danger)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = 'var(--text-tertiary)'
                            }}
                            title="Remover notificação"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm mt-1 leading-5" style={{ color: 'var(--text-secondary)' }}>
                        {notification.description || notification.message}
                      </p>

                      <div className="flex items-center mt-2 space-x-2">
                        <FiClock size={12} style={{ color: 'var(--text-tertiary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {formatRelativeTime(new Date(notification.createdAt || notification.timestamp))}
                        </span>
                        {notification.priority === 'high' && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                            Alta
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsMenu;