"""All tables

Revision ID: 002
Revises: 001
Create Date: 2026-07-25
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, ARRAY

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Categories
    op.create_table(
        'categories',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('slug', sa.String(100), unique=True, index=True, nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('sort_order', sa.Integer, default=0, nullable=False),
    )

    # Photos
    op.create_table(
        'photos',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('slug', sa.String(200), unique=True, index=True, nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('original_file_id', sa.String(100), nullable=False),
        sa.Column('thumbnail_file_id', sa.String(100), nullable=True),
        sa.Column('original_url', sa.String(500), nullable=True),
        sa.Column('thumbnail_url', sa.String(500), nullable=True),
        sa.Column('width', sa.Integer, nullable=False),
        sa.Column('height', sa.Integer, nullable=False),
        sa.Column('file_size', sa.BigInteger, nullable=False),
        sa.Column('format', sa.String(10), nullable=False),
        sa.Column('camera_make', sa.String(100), nullable=True),
        sa.Column('camera_model', sa.String(100), nullable=True),
        sa.Column('lens', sa.String(200), nullable=True),
        sa.Column('focal_length', sa.String(50), nullable=True),
        sa.Column('aperture', sa.String(20), nullable=True),
        sa.Column('shutter_speed', sa.String(50), nullable=True),
        sa.Column('iso', sa.Integer, nullable=True),
        sa.Column('taken_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('location_name', sa.String(200), nullable=True),
        sa.Column('latitude', sa.Float, nullable=True),
        sa.Column('longitude', sa.Float, nullable=True),
        sa.Column('price', sa.Numeric(10, 2), nullable=True),
        sa.Column('is_free', sa.Boolean, default=False, nullable=False),
        sa.Column('is_featured', sa.Boolean, default=False, nullable=False),
        sa.Column('is_published', sa.Boolean, default=True, nullable=False),
        sa.Column('view_count', sa.Integer, default=0, nullable=False),
        sa.Column('download_count', sa.Integer, default=0, nullable=False),
        sa.Column('tags', ARRAY(sa.String), default=[], nullable=False),
        sa.Column('has_watermark', sa.Boolean, default=True, nullable=False),
        sa.Column('category_id', UUID(as_uuid=True), sa.ForeignKey('categories.id'), nullable=True),
        sa.Column('uploaded_by', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
    )

    # Albums
    op.create_table(
        'albums',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('slug', sa.String(200), unique=True, index=True, nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('cover_photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), nullable=True),
        sa.Column('is_published', sa.Boolean, default=True, nullable=False),
        sa.Column('is_featured', sa.Boolean, default=False, nullable=False),
        sa.Column('sort_order', sa.Integer, default=0, nullable=False),
        sa.Column('photo_count', sa.Integer, default=0, nullable=False),
    )

    # Album Photos (association table)
    op.create_table(
        'album_photos',
        sa.Column('album_id', UUID(as_uuid=True), sa.ForeignKey('albums.id'), primary_key=True),
        sa.Column('photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), primary_key=True),
        sa.Column('sort_order', sa.Integer, default=0, nullable=False),
    )

    # Exhibitions
    op.create_table(
        'exhibitions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('slug', sa.String(200), unique=True, index=True, nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('long_description', sa.Text, nullable=True),
        sa.Column('venue', sa.String(200), nullable=True),
        sa.Column('location', sa.String(200), nullable=True),
        sa.Column('start_date', sa.Date, nullable=False),
        sa.Column('end_date', sa.Date, nullable=True),
        sa.Column('cover_image_url', sa.String(500), nullable=True),
        sa.Column('cover_image_file_id', sa.String(100), nullable=True),
        sa.Column('is_virtual', sa.Boolean, default=False, nullable=False),
        sa.Column('exhibition_url', sa.String(500), nullable=True),
        sa.Column('is_published', sa.Boolean, default=True, nullable=False),
    )

    # Exhibition Photos (association table)
    op.create_table(
        'exhibition_photos',
        sa.Column('exhibition_id', UUID(as_uuid=True), sa.ForeignKey('exhibitions.id'), primary_key=True),
        sa.Column('photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), primary_key=True),
        sa.Column('sort_order', sa.Integer, default=0, nullable=False),
    )

    # Favourites
    op.create_table(
        'favourites',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), nullable=False),
        sa.UniqueConstraint('user_id', 'photo_id', name='uq_favourite_user_photo'),
    )

    # Collections
    op.create_table(
        'collections',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('is_public', sa.Boolean, default=True, nullable=False),
    )

    # Collection Photos (association table)
    op.create_table(
        'collection_photos',
        sa.Column('collection_id', UUID(as_uuid=True), sa.ForeignKey('collections.id'), primary_key=True),
        sa.Column('photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), primary_key=True),
    )

    # Carts
    op.create_table(
        'carts',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), unique=True, nullable=False),
    )

    # Cart Items
    op.create_table(
        'cart_items',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('cart_id', UUID(as_uuid=True), sa.ForeignKey('carts.id'), nullable=False),
        sa.Column('photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), nullable=False),
        sa.UniqueConstraint('cart_id', 'photo_id', name='uq_cart_item_cart_photo'),
    )

    # Orders
    op.create_table(
        'orders',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('order_number', sa.String(50), unique=True, index=True, nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('status', sa.Enum('pending', 'paid', 'failed', 'refunded', 'completed', name='order_status'), default='pending', nullable=False),
        sa.Column('total_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('currency', sa.String(3), default='USD', nullable=False),
        sa.Column('payment_provider', sa.Enum('stripe', 'paypal', 'razorpay', name='payment_provider'), nullable=False),
        sa.Column('payment_session_id', sa.String(255), nullable=True),
        sa.Column('payment_id', sa.String(255), nullable=True),
        sa.Column('payment_status', sa.String(50), nullable=True),
        sa.Column('billing_name', sa.String(100), nullable=True),
        sa.Column('billing_email', sa.String(255), nullable=True),
        sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Order Items
    op.create_table(
        'order_items',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('order_id', UUID(as_uuid=True), sa.ForeignKey('orders.id'), nullable=False),
        sa.Column('photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), nullable=False),
        sa.Column('photo_title', sa.String(200), nullable=False),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.UniqueConstraint('order_id', 'photo_id', name='uq_order_item_order_photo'),
    )

    # Downloads
    op.create_table(
        'downloads',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), nullable=False),
        sa.Column('order_id', UUID(as_uuid=True), sa.ForeignKey('orders.id'), nullable=True),
        sa.Column('download_token', sa.String(255), unique=True, nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('download_count', sa.Integer, default=0, nullable=False),
        sa.Column('max_downloads', sa.Integer, default=5, nullable=False),
        sa.Column('ip_address', sa.String(45), nullable=True),
    )

    # Comments
    op.create_table(
        'comments',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('photo_id', UUID(as_uuid=True), sa.ForeignKey('photos.id'), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('is_approved', sa.Boolean, default=True, nullable=False),
    )

    # Notifications
    op.create_table(
        'notifications',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('type', sa.Enum('order', 'download', 'system', 'comment', name='notification_type'), nullable=False),
        sa.Column('is_read', sa.Boolean, default=False, nullable=False),
        sa.Column('link', sa.String(500), nullable=True),
    )

    # Activity Logs
    op.create_table(
        'activity_logs',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('resource_type', sa.String(50), nullable=False),
        sa.Column('resource_id', UUID(as_uuid=True), nullable=True),
        sa.Column('details', sa.JSON, nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('activity_logs')
    op.drop_table('notifications')
    op.drop_table('comments')
    op.drop_table('downloads')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('cart_items')
    op.drop_table('carts')
    op.drop_table('collection_photos')
    op.drop_table('collections')
    op.drop_table('favourites')
    op.drop_table('exhibition_photos')
    op.drop_table('exhibitions')
    op.drop_table('album_photos')
    op.drop_table('albums')
    op.drop_table('photos')
    op.drop_table('categories')
    op.execute('DROP TYPE IF EXISTS notification_type')
    op.execute('DROP TYPE IF EXISTS payment_provider')
    op.execute('DROP TYPE IF EXISTS order_status')
