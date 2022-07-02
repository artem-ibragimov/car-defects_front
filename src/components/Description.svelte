<div class="description-block">
    <ul class="breadcrumbs">
        <li><a href="#">Бренд</a></li>
        <li><a href="#">Модель</a></li>
        <li><a href="#">Поколение</a></li>
        <li><a href="#">Версия</a></li>
    </ul>
</div>




<style>
    .description-block{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgb(255, 255, 255);
        width: 670px;
        border-radius: 30px;
        box-shadow: 15px 12px 40px -2px #094e9439;
        margin-bottom: 50px;
    }
    .breadcrumbs {
    margin: 0; padding: 0;
}
    .breadcrumbs a{
        font-size: 14px;
        color: #33A02C;
}
    .breadcrumbs li {
    display: inline-block;
}
.breadcrumbs li::before {
    content: '>>'; 
    margin-left: 5px; 
    margin-right: 5px;
    color: #33A02C;
}
.breadcrumbs li:first-child::before {
    content: '';
}
</style>
