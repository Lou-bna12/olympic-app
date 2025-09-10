from .auth import router as auth_router
from .reservations import router as reservations_router
from .admin import router as admin_router
from .payment import router as payment_router
from .tickets import router as tickets_router  

__all__ = ['auth_router', 'reservations_router', 'admin_router', 'payment_router', 'tickets_router'] 