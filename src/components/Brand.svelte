<div class="left-block">
    <div class="add">
        <p>Добавить</p>
        <button>+</button>
    </div>
    
        <div class="brand">
            <div class="flex-brand">   
                {#each ['Toyota','Ford', 'Volkswagen','Nissan', 'Kia', 'Renault' ] as car}
                <p class={"entity "+car}>
                    {car}
                </p>
                {/each} </div>
        <button class="clear" >Очистить все</button>
    </div>
</div>



<style>
    .left-block{
        position: sticky;
    }
.add{
    display: flex;
    width: 269px;
    height: 51px;
    background: white;
    border-radius: 7px;
    box-shadow: 8px 4px 20px 1px #094e9439;
    justify-content: space-around;
    font-size: 17px;
    align-items:center
}
.add button{
    background: none;
    border: none;
    font-size: 30px;
    font-weight: 400;
    color: #094F94;
}
.flex-brand {
    display: flex;
    flex-direction: column;
    margin-top: 25px;
    margin-bottom: 30px;
    gap: 30px;

}
.brand{
    display: flex;
    flex-direction: column;
    width: 269px;
    border-radius: 10px;
    box-shadow: 8px 4px 20px 1px #094e9439;
    background: rgb(255, 255, 255);
    justify-content: center;
    align-items:center;
    margin-top: 40px;
}

.entity{
    display: flex;
    border: 2px;
    border-radius: 5px;
    width: 186px;
    height: 36px;
    justify-content: center;
    align-items: center;
    letter-spacing: 0,3em;
    font-weight: 500;
    margin: 0;
}

.Toyota{
    border:solid #33A02C;
    background: #34a02c18;
    color: #33A02C;
}
.Ford{
    border:solid #337A9F;
    background: #33799f1f;
    color: #337A9F;
}
.clear{
    border: 1px solid #094F94;
    color: #094F94;
    background: none;
    font-size: 15px;
    font-weight: 400;
    border-radius: 5px;
    padding: 8px 20px;
    margin-bottom: 25px;
}
.clear:hover{
    background: #094F94;
    color: rgb(255, 255, 255);
}
</style>