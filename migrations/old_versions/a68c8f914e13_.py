"""empty message

Revision ID: a68c8f914e13
Revises: 1e95534d52ba
Create Date: 2023-08-04 14:43:43.266770

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'a68c8f914e13'
down_revision = '1e95534d52ba'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Pages', 'type')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Pages', sa.Column('type', mysql.VARCHAR(length=128), nullable=True))
    # ### end Alembic commands ###