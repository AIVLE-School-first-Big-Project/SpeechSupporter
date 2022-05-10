
from django_filters import (
    FilterSet,
    CharFilter,
    NumberFilter,
    OrderingFilter,
)
from .models import Post

class PostFilter(FilterSet):
    count = NumberFilter()

    #Specific
    user = CharFilter(field_name='user', lookup_expr="exact", label='user.nick_name')
    title = CharFilter(field_name='title', lookup_expr="icontains")
    category = CharFilter(field_name='category', lookup_expr="exact")
    count__gt = NumberFilter(field_name='like', lookup_expr='gt')
    count__lt = NumberFilter(field_name='like', lookup_expr='lt')
    message = CharFilter(field_name = 'content',lookup_expr="icontains")

    #Ordering
    order_by_field = 'ordering'
    ordering = OrderingFilter(
        fields = (
            'create_dt',
            'view_count',
            'like'
        )
    )
    
    class Meta:
        model = Post
        fields = ['user', 'title', 'category', 'content', 'like']

    def __init__(self, *args, **kwargs):
        super(PostFilter, self).__init__(*args, **kwargs)
     