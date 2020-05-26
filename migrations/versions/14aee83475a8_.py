"""empty message

Revision ID: 14aee83475a8
Revises: 5bc4c57b035a
Create Date: 2020-05-05 15:49:08.497768

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '14aee83475a8'
down_revision = '5bc4c57b035a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Pages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=128), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['Users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Pages')
    # ### end Alembic commands ###
