"""empty message

Revision ID: 1e95534d52ba
Revises: 5fbc2aa1ae2f
Create Date: 2023-08-04 13:50:29.680425

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '1e95534d52ba'
down_revision = '5fbc2aa1ae2f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users-permissions_permission')
    op.drop_table('ToDos')
    op.drop_table('Notes')
    op.drop_index('users-permissions_user_username_unique', table_name='users-permissions_user')
    op.drop_table('users-permissions_user')
    op.drop_table('strapi_webhooks')
    op.drop_index('strapi_administrator_email_unique', table_name='strapi_administrator')
    op.drop_table('strapi_administrator')
    op.drop_index('i18n_locales_code_unique', table_name='i18n_locales')
    op.drop_table('i18n_locales')
    op.drop_table('upload_file')
    op.drop_table('strapi_permission')
    op.drop_table('parents')
    op.drop_index('strapi_role_code_unique', table_name='strapi_role')
    op.drop_index('strapi_role_name_unique', table_name='strapi_role')
    op.drop_table('strapi_role')
    op.drop_index('users-permissions_role_type_unique', table_name='users-permissions_role')
    op.drop_table('users-permissions_role')
    op.drop_table('upload_file_morph')
    op.drop_table('Pages_User_1')
    op.drop_table('core_store')
    op.drop_table('strapi_users_roles')
    op.add_column('Pages', sa.Column('global_id', sa.Integer(), nullable=False))
    op.alter_column('Pages', 'user_id',
               existing_type=mysql.INTEGER(),
               nullable=False)
    op.create_unique_constraint('uix_user_id_id', 'Pages', ['user_id', 'id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('uix_user_id_id', 'Pages', type_='unique')
    op.alter_column('Pages', 'user_id',
               existing_type=mysql.INTEGER(),
               nullable=True)
    op.drop_column('Pages', 'global_id')
    op.create_table('strapi_users_roles',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('role_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('core_store',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('key', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('value', mysql.LONGTEXT(), nullable=True),
    sa.Column('type', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('environment', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('tag', mysql.VARCHAR(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('Pages_User_1',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('title', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['Users.id'], name='pages_user_1_ibfk_1'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('upload_file_morph',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('upload_file_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('related_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('related_type', mysql.LONGTEXT(), nullable=True),
    sa.Column('field', mysql.LONGTEXT(), nullable=True),
    sa.Column('order', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('users-permissions_role',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('description', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('type', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('created_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('updated_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('users-permissions_role_type_unique', 'users-permissions_role', ['type'], unique=True)
    op.create_table('strapi_role',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('code', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('description', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('created_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('strapi_role_name_unique', 'strapi_role', ['name'], unique=True)
    op.create_index('strapi_role_code_unique', 'strapi_role', ['code'], unique=True)
    op.create_table('parents',
    sa.Column('parent_page_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('child_page_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['child_page_id'], ['Pages.id'], name='parents_ibfk_1'),
    sa.ForeignKeyConstraint(['parent_page_id'], ['Pages.id'], name='parents_ibfk_2'),
    sa.PrimaryKeyConstraint('parent_page_id', 'child_page_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('strapi_permission',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('action', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('subject', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('properties', mysql.LONGTEXT(), nullable=True),
    sa.Column('conditions', mysql.LONGTEXT(), nullable=True),
    sa.Column('role', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('upload_file',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('alternativeText', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('caption', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('width', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('height', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('formats', mysql.LONGTEXT(), nullable=True),
    sa.Column('hash', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('ext', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('mime', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('size', mysql.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('url', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('previewUrl', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('provider', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('provider_metadata', mysql.LONGTEXT(), nullable=True),
    sa.Column('created_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('updated_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('i18n_locales',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('code', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('created_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('updated_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('i18n_locales_code_unique', 'i18n_locales', ['code'], unique=True)
    op.create_table('strapi_administrator',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('firstname', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('lastname', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('username', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('email', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('password', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('resetPasswordToken', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('registrationToken', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('isActive', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.Column('blocked', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.Column('preferedLanguage', mysql.VARCHAR(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('strapi_administrator_email_unique', 'strapi_administrator', ['email'], unique=True)
    op.create_table('strapi_webhooks',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('url', mysql.LONGTEXT(), nullable=True),
    sa.Column('headers', mysql.LONGTEXT(), nullable=True),
    sa.Column('events', mysql.LONGTEXT(), nullable=True),
    sa.Column('enabled', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('users-permissions_user',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('username', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('email', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('provider', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('password', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('resetPasswordToken', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('confirmationToken', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('confirmed', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.Column('blocked', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.Column('role', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('updated_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.Column('updated_at', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('users-permissions_user_username_unique', 'users-permissions_user', ['username'], unique=True)
    op.create_table('Notes',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('text', mysql.VARCHAR(length=128), nullable=True),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('page_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('css', mysql.VARCHAR(length=1000), nullable=True),
    sa.Column('x', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('y', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['page_id'], ['Pages.id'], name='notes_ibfk_2'),
    sa.ForeignKeyConstraint(['user_id'], ['Users.id'], name='notes_ibfk_1'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('ToDos',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('text', mysql.VARCHAR(length=128), nullable=True),
    sa.Column('status', mysql.VARCHAR(length=128), nullable=True),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('page_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['page_id'], ['Pages.id'], name='todos_ibfk_1'),
    sa.ForeignKeyConstraint(['user_id'], ['ToDos.id'], name='todos_ibfk_2'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('users-permissions_permission',
    sa.Column('id', mysql.INTEGER(unsigned=True), autoincrement=True, nullable=False),
    sa.Column('type', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('controller', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('action', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('enabled', mysql.TINYINT(display_width=1), autoincrement=False, nullable=False),
    sa.Column('policy', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('role', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('updated_by', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###
