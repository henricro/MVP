"""empty message

Revision ID: dece02561de4
Revises: 80b7bdba2724
Create Date: 2023-08-13 12:48:12.654224

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dece02561de4'
down_revision = '80b7bdba2724'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Pages', sa.Column('password', sa.String(length=100), nullable=True))
    op.add_column('Pages', sa.Column('status', sa.String(length=128), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Pages', 'status')
    op.drop_column('Pages', 'password')
    # ### end Alembic commands ###