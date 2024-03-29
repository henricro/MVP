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

    # ### end Alembic commands ###

